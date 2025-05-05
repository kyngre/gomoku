from app.strategies.random_ai import get_random_move

def get_strategy(name):
    return {
        "easy": get_random_move,
    }.get(name)
