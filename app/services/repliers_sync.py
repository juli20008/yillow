import time
import requests
from datetime import datetime
from flask import current_app
from sqlalchemy.dialects.postgresql import insert as pg_insert

from ..models.db import db
from ..models.mls_agent import MlsAgent

REPLIERS_BASE_URL = 'https://api.repliers.io'
BATCH_SIZE = 500
REQUEST_DELAY = 0.2  # seconds between pages to avoid rate limiting


def _get_headers():
    api_key = current_app.config.get('REPLIERS_API_KEY')
    return {
        'REPLIERS-API-KEY': api_key,
        'Content-Type': 'application/json',
    }


def _fetch_page(page_num, results_per_page=BATCH_SIZE):
    url = f'{REPLIERS_BASE_URL}/members'
    params = {'pageNum': page_num, 'resultsPerPage': results_per_page}
    resp = requests.get(url, headers=_get_headers(), params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def _transform(member):
    first = (member.get('firstName') or member.get('first_name') or '').strip()
    last = (member.get('lastName') or member.get('last_name') or '').strip()
    full = (member.get('name') or f'{first} {last}').strip()

    raw_lat = member.get('lat') or member.get('latitude')
    raw_lng = member.get('lng') or member.get('longitude') or member.get('long')

    return {
        'repliers_id': str(member.get('memberId') or member.get('id', '')),
        'first_name': first[:100] or None,
        'last_name': last[:100] or None,
        'full_name': full[:200] or None,
        'license_id': (str(member.get('licenseNum') or member.get('license_num') or '')
                       .strip()[:50]) or None,
        'email': (member.get('email') or '')[:255] or None,
        'phone': (member.get('phone') or '')[:50] or None,
        'city': (member.get('city') or '')[:100] or None,
        'province': (member.get('province') or member.get('state') or '')[:10] or None,
        'office': (member.get('brokerName') or member.get('broker_name') or
                   member.get('office') or '')[:200] or None,
        'position': (member.get('position') or '')[:100] or None,
        'photo_url': (member.get('photo') or member.get('photoUrl') or '')[:500] or None,
        'lat': float(raw_lat) if raw_lat is not None else None,
        'lng': float(raw_lng) if raw_lng is not None else None,
        'updated_at': datetime.utcnow(),
    }


def _upsert_batch(batch):
    if not batch:
        return 0
    stmt = pg_insert(MlsAgent).values(batch)
    stmt = stmt.on_conflict_do_update(
        index_elements=['repliers_id'],
        set_={
            'first_name': stmt.excluded.first_name,
            'last_name': stmt.excluded.last_name,
            'full_name': stmt.excluded.full_name,
            'license_id': stmt.excluded.license_id,
            'email': stmt.excluded.email,
            'phone': stmt.excluded.phone,
            'city': stmt.excluded.city,
            'province': stmt.excluded.province,
            'office': stmt.excluded.office,
            'position': stmt.excluded.position,
            'photo_url': stmt.excluded.photo_url,
            'lat': stmt.excluded.lat,
            'lng': stmt.excluded.lng,
            'updated_at': stmt.excluded.updated_at,
            # created_at intentionally excluded — preserve original insert time
        }
    )
    db.session.execute(stmt)
    db.session.commit()
    return len(batch)


def sync_agents(max_pages=None, verbose=True):
    """
    Pull all members from Repliers API and UPSERT into mls_agents.
    Safe to re-run; duplicate records are updated, not duplicated.
    Returns the total number of rows processed.
    """
    probe = _fetch_page(1, results_per_page=1)
    num_pages = probe.get('numPages', 1)
    total_records = probe.get('count', 0)

    if max_pages:
        num_pages = min(num_pages, max_pages)

    if verbose:
        print(f'[repliers] {total_records} agents across {num_pages} pages')

    total_upserted = 0
    for page in range(1, num_pages + 1):
        if verbose:
            print(f'[repliers] page {page}/{num_pages}...', end=' ', flush=True)

        data = _fetch_page(page)
        members = data.get('results') or data.get('members') or []
        valid = [_transform(m) for m in members
                 if (m.get('memberId') or m.get('id'))]

        count = _upsert_batch(valid)
        total_upserted += count

        if verbose:
            print(f'{count} upserted (running total: {total_upserted})')

        if page < num_pages:
            time.sleep(REQUEST_DELAY)

    if verbose:
        print(f'[repliers] Sync complete — {total_upserted} total rows upserted.')

    return total_upserted
