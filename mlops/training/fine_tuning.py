import warnings
import os
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '0'

import tensorflow as tf
tf.get_logger().setLevel('ERROR')
from tensorflow.keras.models import load_model
import tensorflow.keras as keras
from tensorflow.keras import layers, models
import numpy as np
from sklearn.model_selection import train_test_split
from glob import glob
from tqdm import tqdm
from datetime import datetime
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau


X = np.load('./train_data/X_player.npy').astype(np.float32)[..., np.newaxis]
y = np.load('./train_data/y_player.npy').astype(np.float32)

y = y.reshape(y.shape[0], -1).astype(np.float32)

gpus = tf.config.experimental.list_logical_devices('GPU')
strategy = tf.distribute.MirroredStrategy([gpu.name for gpu in gpus])
print('\n\n Running on multiple GPUs ', [gpu.name for gpu in gpus])

with strategy.scope():
    model = load_model('mlops/training/models/fine_tuned_20250514_140607.h5')
    # (선택) 일부 레이어 동결
    # for layer in model.layers[:-2]:
    #     layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss='binary_crossentropy',
        metrics=['acc']
    )

# 러닝레이트 스케줄러만 사용
callbacks = [
    ReduceLROnPlateau(monitor='acc', factor=0.2, patience=5, verbose=1)
]

# 학습
model.fit(
    x=X, y=y,
    batch_size=128,
    epochs=10,
    callbacks=callbacks,
#    use_multiprocessing=True,
#    workers=16
)

# 학습 완료 후 최종 모델 저장
start_time = datetime.now().strftime('%Y%m%d_%H%M%S')
os.makedirs('models', exist_ok=True)
# 모델 저장 경로 설정
model.save(f'mlops/models/fine_tuned_{start_time}.h5')
print(f"▶ Fine-tuned model saved to models/fine_tuned_{start_time}.h5")