import Board from './components/Board';

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>오목 AI 웹</h1>
      <Board />
    </div>
  );
}

export default App;
