"""empty message

Revision ID: 619f45d755a0
Revises: bd0f1a0ee35f
Create Date: 2019-04-04 18:59:47.018367

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '619f45d755a0'
down_revision = 'bd0f1a0ee35f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'user_profiles', ['username'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user_profiles', type_='unique')
    # ### end Alembic commands ###