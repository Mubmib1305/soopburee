from flask import Blueprint

mobile_bp = Blueprint('mobile', __name__)
display_bp = Blueprint('display', __name__)

from .mobile import *
from .display import *