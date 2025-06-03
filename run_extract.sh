#!/bin/bash
cd gomoku
source conda activate tf-gpu2  # Conda 환경 활성화
python mlops/data/extract_player_win.py