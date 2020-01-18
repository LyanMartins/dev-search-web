import React, { useState, useEffect } from 'react';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

// componente: Bloco isolado de html, css e js, o qual nao interfere no restante da aplicação
// estado : informações mantidas pelo componente (Lembrar: imutabilidade)
// propriedade: informação de um componente PAI  passa para o componente FILHO

import Header from './Header';
import api from './services/api';
import DevItem from './components/DevItem';



function App() {
  const [devs, setDevs] = useState([])
  const [github_username, setGithubUserName] = useState('')
  const [techs, setTechs] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude)
      },  
      (error)=>{
        console.log(error)
      },{
        timeout: 30000,
      }
    );
  }, []);

  useEffect(() => {
    async function loadDev() {
      const response = await api.get('/devs');
      
      setDevs(response.data);
    }
    loadDev();
  },[])
  async function handleAddDev(e){
    e.preventDefault();

    const response = await api.post('/devs',{
      github_username,
      techs,
      latitude,
      longitude,
    })

    setGithubUserName('')
    setTechs('')

    setDevs([...devs, response.data])

  }
  return (
      <div id="app">
        <aside>
          <strong>Cadastrar</strong>
          <form onSubmit={handleAddDev}>

            <div className="input-block">
              <label htmlFor="github_username">Usuario</label>
              <input name="github_username" 
              id="github_username" 
              required
              onChange={e => setGithubUserName(e.target.value)}
              />
            </div>
            
            <div className="input-block">
              <label htmlFor="techs">Tecnologia</label>
              <input name="techs" 
              id="techs" 
              required
              onChange={e => setTechs(e.target.value)}
            />
            </div>

            <div className="input-group">
              <div className="input-block">
                 <label htmlFor="latitude">Latitude</label>
                 <input type="number" 
                 name="latitude" 
                 id="latitude" 
                 required  
                 value={longitude}
                 onChange={e => setLongitude(e.target.value)}
                 />
              </div>

              <div className="input-block">
                 <label htmlFor="longitude">Longitude</label>
                 <input  type="number" 
                 name="longitude" 
                 id="longitude" 
                 required  
                 value={longitude} 
                 onChange={e => setLongitude(e.target.value)}
                 />
              </div>
           </div>
            <button type="submit">Salvar</button>
          </form>
        </aside>
        <main>
          <ul>
            {devs.map(dev => (
              <DevItem key={dev.id_} dev={dev} />
            ))}
            
          </ul>
        </main>
      </div>
  );
}

export default App;
