from app.strategies.random_ai import get_random_move
from app.strategies.mini_max_ai import get_mini_max_move

def get_strategy(name):
    return {
        "easy": get_random_move,
        "medium": get_mini_max_move,
    }.get(name)
