from flask.cli import AppGroup
from .services.repliers_sync import sync_agents

repliers_commands = AppGroup('repliers')


@repliers_commands.command('sync-agents')
def sync_agents_cmd():
    """Fetch all agents from Repliers API and upsert into mls_agents table."""
    sync_agents(verbose=True)
