import { config } from '../config.js'
import httpService from "./http.services";

const urlServidor = config.urlResourceGeneros;

async function Buscar() {
    try {
        const resp = await httpService.get(urlServidor);
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
    try {
        console.log(item.IdGenero);
        const resp = await httpService.get(urlServidor + "/" +item.IdGenero);
        return resp.data;
    } catch (error) {
        console.error("Error al buscar el género por ID:", error);
        throw error;
    }
}


async function Agregar(genero) {
    try {
        const resp = await httpService.post(urlServidor, genero);
        return resp.data;
    } catch (error) {
        console.error("Error al agregar el género:", error);
        throw error;
    }
}

async function Modificar(genero) {
    try {
        const resp = await httpService.put(urlServidor + "/" + genero.IdGenero, genero);
        return resp.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        console.error("Error al modificar el género:", error);
        throw error;
    }
}

async function BuscarPorNombre(nombre) {
    try {
        const resp = await httpService.get(`${urlServidor}?nombre=${encodeURIComponent(nombre)}`);
        return resp.data;
    } catch (error) {
        console.error("Error en la solicitud de búsqueda por nombre:", error);
        throw error;
    }
}

async function Eliminar(IdGenero) {
    try {
        console.log(IdGenero)
        const response = await httpService.delete(`${urlServidor}/${IdGenero}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el genero:', error);
        throw error;
    }
}

export const GenerosService = {
    Buscar, Agregar, Modificar, BuscarPorId, BuscarPorNombre, Eliminar
}