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
  columns: number;
};

function App() {
  const [count, setCount] = useState(0)
  const [contents, setContents] = useState<Content[]>([]);
  useEffect(() => {
    const length = Math.floor(Math.random() * 50) + 5;
    
    (async () => {
      const {data} = await ky.get(`https://fakerapi.it/api/v1/texts?_quantity=${length}`).json<{data: Content[]}>();
      setContents(data.map(item => {
        const val = Math.random();
        const columns = val > 0.4 ? 1 
          : val > 0.2 ? 2
          : val > 0.1 ? 3
          : 1;
        return {
          ...item,
          columns,
        };
      }));
    })();
  }, []);

  return (
    <div className="App">
      <Masonry>
        {contents.map(({title, content, columns}, i) => 
          <MasonryBox 
            columns={columns}
            key={`div-${i}`}>
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
