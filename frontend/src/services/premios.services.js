import axios from 'axios';
import { config } from '../config.js'

const urlServidor = config.urlResourcePremios;
async function Buscar() {
    try {
        const res = await axios.get(urlServidor); 
        return res.data;
    }
    catch (error) {
        console.error('Error al buscar los premios:', error);
    }
}
async function BuscarPorId(IdPremio) {
    try {
        const res = await axios.get(urlServidor); 
        return res.data.find((premio) => premio.IdPremio === IdPremio);
    } catch (error) {
        console.error('Error al buscar el premio:', error);
    }
}
async function Agregar(premio) {
    try {
        const res = await axios.post(urlServidor, premio);
        console.log('Premio agregado con éxito:', res.data);
    } catch (error) {
        console.error('Error al agregar el premio:', error);
    }
}

async function Modificar(premio) {
    try {

        const res = await axios.get(urlServidor);
        const premios = res.data;

        let premioEncontrado = premios.find((premiofind) => premiofind.IdPremio === premio.IdPremio);

        if (premioEncontrado) {
            const respuesta = await axios.put(`${urlServidor}/${premio.IdPremio}`, premio);
            console.log('Premio modificado con éxito:', respuesta.data);
        } else {
            console.error('Premio no encontrado');
        }
    } catch (error) {
        console.error('Error al modificar el premio:', error);
    }
}
async function Eliminar(IdPremio) {
    try {
        const response = await axios.delete(`${urlServidor}/${IdPremio}`);
        console.log('Premio eliminado con éxito:', response.data);
    } catch (error) {
        console.error('Error al eliminar el premio:', error);
    }
}

export const PremiosService = {
    Buscar, BuscarPorId, Agregar, Modificar, Eliminar
};