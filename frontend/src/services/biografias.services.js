import axios from 'axios';
import httpService from "./http.services";
import { config } from '../config.js';
const urlResource = config.urlResourceBiografias;
const urlArtistas = config.urlResourceArtistas;

async function Buscar(nombre = "") {
    try {
        const resp = await httpService.get(`${urlResource}?nombre=${encodeURIComponent(nombre)}`);
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
    console.log(item.Id);
    const resp = await httpService.get(urlResource + "/" + item.Id);
    return resp.data;
}

async function ActivarDesactivar(item) {
    await httpService.delete(urlResource + "/" + item.Id);
}

async function Agregar(item) {
    try {
        const resp = await httpService.post(urlResource, item);
        return resp.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        console.error("Error al crear la biografia:", error);
        throw error;
    }
}

async function Agregar2(item) {
    try {
        const resp = await httpService.put(urlResource + "/" + item.Id, item);
        return resp.data;
    } catch (error) {
        console.error("Error al actualizar la biografia:", error);
        throw error;
    }
}

async function Modificar(item) {
    try {
        const resp = await httpService.put(urlResource + "/" + item.Id, item);
        return resp.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        console.error("Error al actualizar la biografia:", error);
        throw error;
    }
}

async function Eliminar(Id) {
    try {
        console.log(Id)
        const response = await httpService.delete(`${urlResource}/${Id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la biografia:', error);
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

export const BiografiasService = {
    Buscar,
    BuscarPorId,
    ActivarDesactivar,
    Agregar,
    Agregar2,
    Modificar,
    BuscarArtistas,
    Eliminar,
};