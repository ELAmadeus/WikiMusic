import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { Inicio } from "./components/Inicio";
import { Menu } from "./components/Menu";
import { Footer } from "./components/Footer";

import { Albumes } from "./components/albumes/Albumes";
import { Artistas } from "./components/artistas/Artistas";
import { Canciones } from "./components/canciones/Canciones";
import { Conciertos } from "./components/conciertos/Conciertos";
import { Generos } from "./components/generos/Generos";
import { Biografias } from "./components/biografias/Biografias";
import { Premios } from "./components/premios/Premios";

import { Sellos } from "./components/sellos/Sellos";


import { ModalDialog } from "./components/ModalDialog";

import { RequireAuth } from "./components/RequiereAuth";
import { Login } from "./components/login/Login.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <ModalDialog />
        <Menu />
        <div className="divBody">
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
            
            <Route path="/albumes" element={<Albumes />} />
            <Route path="/artistas" element={<Artistas/>} />
            <Route path="/canciones" element={<Canciones/>} />      
            <Route 
            path="/conciertos" 
            element={
              <RequireAuth>
              <Conciertos/>
              </RequireAuth>
            }
          />
          <Route path="/login/:componentFrom" element={<Login />} />
            <Route path="/generos" 
            element={
              <RequireAuth>
                <Generos/>
              </RequireAuth>
            } />
            <Route path="/premios" element={<Premios/>} />
            <Route
              path="/biografias"
              element={
                <RequireAuth>
                  <Biografias/>
                </RequireAuth>
              }
            />
            
            <Route
              path="/sellos"
              element={
                <RequireAuth>
                  <Sellos/>
                </RequireAuth>
              }
            />
            <Route path="/login/:componentFrom" element={<Login />} />
            
            <Route path="*" element={<Navigate to="/inicio" replace />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}
export default App;