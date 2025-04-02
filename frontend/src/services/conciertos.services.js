import axios from 'axios';
import httpService from "./http.services";
import { config } from '../config.js';
const urlResource = config.urlResourceConciertos;
const urlArtistas = config.urlResourceArtistas;

async function Buscar() {
    try {
        const resp = await httpService.get(urlResource);
        if (resp && resp.data) {
            return resp.data;
        } else {
            console.error("Error: Respuesta inesperada del servidor.");
            return [];
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}

async function BuscarPorId(item) {
    console.log(item.IdConcierto);
    const resp = await httpService.get(urlResource + "/" + item.IdConcierto);
    return resp.data;
}

async function Agregar(item) {
    try {
        const resp = await httpService.post(urlResource, item);
        return resp.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        console.error("Error al crear el Concierto:", error);
        throw error;
    }
}


async function Modificar(item) {
    try {
        const resp = await httpService.put(urlResource + "/" + item.IdConcierto, item);
        return resp.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        console.error("Error al actualizar el Concierto:", error);
        throw error;
    }
}

async function BuscarPorNombre(nombre) {
    try {
        const resp = await httpService.get(`${urlResource}?nombre=${encodeURIComponent(nombre)}`);
        return resp.data;
    } catch (error) {
        console.error("Error en la solicitud de búsqueda por nombre:", error);
        throw error;
    }
}

async function Eliminar(IdConcierto) {
    try {
        console.log(IdConcierto)
        const response = await httpService.delete(`${urlResource}/${IdConcierto}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el concierto:', error);
        throw error;
    }
}

async function BuscarArtistas() {
    try {
        const res = await axios.get(urlArtistas); 
        return res.data;
    }
    catch (error) {
        console.error('Error al buscar los artistas:', error);
    }
}
export const ConciertosService = {
    Buscar,
    BuscarPorId,
    Agregar,
    Modificar,
    Eliminar,
    BuscarPorNombre,
    BuscarArtistas,
};