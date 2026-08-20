import { useState } from 'react'
import { Tabs }  from 'antd'
import All from './components/All/All'
import './App.css'

function App() {
  const [key, setKey] = useState('1');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabChange = (newKey) => {
    setKey(newKey);
    setRefreshKey(prev => prev + 1);
    console.log(newKey);
  };
  
  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const items = [
    {
      key: '1',
      label: 'All',
      children: <All pagekey={1} onUpdate={handleUpdate} refreshKey={refreshKey}/>,
    },
    {
      key: '2',
      label: 'Active',
      children: <All pagekey={2} onUpdate={handleUpdate} refreshKey={refreshKey}/>,
    },
    {
      key: '3',
      label: 'Completed',
      children: <All pagekey={3} onUpdate={handleUpdate} refreshKey={refreshKey}/>,
    },
  ];

  return (
    <div className="App">
      <div className='header'>
        <h1>#todo</h1>
      </div>
      <Tabs onChange={handleTabChange} className='tabchange' defaultActiveKey='1' items={items}></Tabs>
    </div>
  )
}

export default App
