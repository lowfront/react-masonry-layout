import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Masonry from './masonry/Masonry'
import MasonryBox from './masonry/MasonryBox'
import ky from 'ky';

type Content = {
  title: string;
  author: string;
  content: string;
  genre: string;
};

function App() {
  const [count, setCount] = useState(0)
  const [contents, setContents] = useState<Content[]>([]);
  useEffect(() => {
    const length = Math.floor(Math.random() * 30) + 5;
    
    (async () => {
      const {data} = await ky.get(`https://fakerapi.it/api/v1/texts?_quantity=${length}`).json<{data: Content[]}>();
      setContents(data);
    })();
  }, []);

  return (
    <div className="App">
      <Masonry>
        {contents.map(({title, content}, i) => 
          <MasonryBox key={`div-${i}`}>
            <div style={{
              position: 'relative',
              border: '1px solid #ccc',
              // background: 'green',
              boxSizing: 'border-box',
              padding: '5px 10px',
              borderRadius: 10
            }}>
              <h3>{title}</h3>
              <p>{content}</p>
            </div>
          </MasonryBox>)}
      </Masonry>
    </div>
  )
}

export default App
