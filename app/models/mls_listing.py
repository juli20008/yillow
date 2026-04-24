from .db import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB


class MlsListing(db.Model):
    __tablename__ = 'mls_listings'

    id = db.Column(db.Integer, primary_key=True)
    mls_number = db.Column(db.String(50), nullable=False, unique=True)
    status = db.Column(db.String(20), index=True)          # A, U, etc.
    standard_status = db.Column(db.String(30))             # Active, Sold, etc.
    property_class = db.Column(db.String(50))              # CondoProperty, etc.
    transaction_type = db.Column(db.String(20))            # Sale / Lease

    list_price = db.Column(db.Integer, index=True)
    sold_price = db.Column(db.Integer)
    original_price = db.Column(db.Integer)
    list_date = db.Column(db.DateTime)
    sold_date = db.Column(db.DateTime)
    last_status = db.Column(db.String(50))

    # Address
    street_number = db.Column(db.String(20))
    street_name = db.Column(db.String(100))
    street_suffix = db.Column(db.String(30))
    unit_number = db.Column(db.String(20))
    city = db.Column(db.String(100), index=True)
    state = db.Column(db.String(10))
    zip = db.Column(db.String(15))
    country = db.Column(db.String(10))
    neighborhood = db.Column(db.String(100))

    # Geo — NUMERIC for precise range queries
    lat = db.Column(db.Numeric(10, 7))
    lng = db.Column(db.Numeric(10, 7))

    # Property details
    bed = db.Column(db.Integer, index=True)
    bath = db.Column(db.Integer)
    sqft = db.Column(db.String(20))
    year_built = db.Column(db.String(10))
    style = db.Column(db.String(100))
    property_type = db.Column(db.String(50))
    description = db.Column(db.Text)

    # Images stored as JSON array
    images = db.Column(JSONB, default=list)

    # Agent / brokerage
    agent_name = db.Column(db.String(100))
    agent_email = db.Column(db.String(255))
    brokerage = db.Column(db.String(200))

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow,
                           onupdate=datetime.utcnow)

    @property
    def street(self):
        parts = filter(None, [self.street_number, self.street_name, self.street_suffix])
        return ' '.join(parts)

    @property
    def front_img(self):
        imgs = self.images or []
        return imgs[0] if imgs else None

    def to_dict(self):
        return {
            'id': self.id,
            'mls_number': self.mls_number,
            'status': self.standard_status or self.status,
            'type': self.transaction_type,
            'class': self.property_class,
            'price': self.list_price,
            'sold_price': self.sold_price,
            'list_date': self.list_date.isoformat() if self.list_date else None,
            'street': self.street,
            'unit': self.unit_number,
            'city': self.city,
            'state': self.state,
            'zip': self.zip,
            'country': self.country,
            'neighborhood': self.neighborhood,
            'lat': float(self.lat) if self.lat is not None else None,
            'lng': float(self.lng) if self.lng is not None else None,
            'bed': self.bed,
            'bath': self.bath,
            'sqft': self.sqft,
            'year_built': self.year_built,
            'style': self.style,
            'property_type': self.property_type,
            'description': self.description,
            'front_img': self.front_img,
            'images': self.images or [],
            'agent_name': self.agent_name,
            'brokerage': self.brokerage,
        }
