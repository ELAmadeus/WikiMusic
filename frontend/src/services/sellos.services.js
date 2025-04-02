import { config } from "../config";
import httpService from "./http.services";
const urlResource = config.urlResourceSellos;

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
    const resp = await httpService.get(urlResource + "/" + item.IdSello);
    return resp.data;
}

async function Eliminar(IdSello) {
    try {
        console.log(IdSello)
        const response = await httpService.delete(`${urlResource}/${IdSello}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el sello:', error);
        throw error;
    }
}


async function Agregar(item) {
    try {
        const resp = await httpService.post(urlResource, item);
        return resp.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        console.error("Error al crear el sello:", error);
        throw error;
    }
}

async function Modificar(item) {
    try {
        const resp = await httpService.put(urlResource + "/" + item.IdSello, item);
        return resp.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        console.error("Error al actualizar el sello:", error);
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

export const SellosService = {
    Buscar,
    BuscarPorId,
    Eliminar,
    Agregar,
    Modificar,
    BuscarPorNombre
};