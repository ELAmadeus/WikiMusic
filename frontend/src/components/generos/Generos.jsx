import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerosListado from "./GenerosListado";
import GenerosRegistro from "./GenerosRegistro";
import { GenerosService } from "../../services/generos.services";
import modalDialogService from "../../services/modalDialog.services";

function Generos() {
  const TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)",
  };

  const { register, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      AccionABMC: "L",
      Items: null,
      Item: null,    
      RegistrosTotal: 0,
      searchTerm: "",
    },
  });

  const AccionABMC = watch("AccionABMC");
  const searchTerm = watch("searchTerm");
  const Items = watch("Items");
  const Item = watch("Item");

  useEffect(() => {
    Buscar();
  }, []);

  async function Buscar() {
    modalDialogService.BloquearPantalla(true);
    try {
      const data = await GenerosService.Buscar();
      modalDialogService.BloquearPantalla(false);
      setValue("Items", data);
      setValue("RegistrosTotal", data.length);
    } catch (error) {
      console.error("Error al buscar:", error);
    }
  }

  async function BuscarGenerosPorNombre() {
    if (searchTerm.trim() === "") {
      return Buscar();
    }
    try {
      const data = await GenerosService.BuscarPorNombre(searchTerm);
      setValue("Items", data);
      setValue("RegistrosTotal", data.length);
    } catch (error) {
      console.error("Error en la búsqueda por nombre:", error);
      alert("¡Error! No se pudo realizar la búsqueda.");
    }
  }

  function handleSearchChange(e) {
    setValue("searchTerm", e.target.value);
  }

  async function BuscarPorId(item, accionABMC) {
    try {
      const data = await GenerosService.BuscarPorId(item);
      setValue("Item", data);
      setValue("AccionABMC", accionABMC);
    } catch (error) {
      console.error("Error al buscar por ID:", error);
      alert("¡Error! No se pudo obtener los detalles del Género");
    }
  }

  function Consultar(item) {
    BuscarPorId(item, "C");
  }

  function Modificar(item) {
    BuscarPorId(item, "M");
  }

  async function Agregar() {
    setValue("AccionABMC", "A");
  }

  async function Eliminar(IdGenero) {
    modalDialogService.Confirm(
      "¿Está seguro que desea eliminar este Género? Si lo hace, los álbumes asociados a este género tendrán el campo género como Desconocido.",
      undefined,
      undefined,
      undefined,
      async () => {       
        try { 
        await GenerosService.Eliminar(IdGenero);
        await Buscar();
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("¡Error! No se pudo eliminar el Género.");
      }
    }
  );
}

  async function Grabar(item) {
    if (AccionABMC === "M") {
      modalDialogService.Confirm(
        "¿Está seguro que desea modificar este Género? Si lo hace, también se modificará el álbum asociado si es que tiene.",
        undefined,
        undefined,
        undefined,
        async () => {
          try {
            await GenerosService.Modificar(item);
            await Buscar();
            Volver();
            setTimeout(() => {
              alert("Género modificado.");
            }, 0);
          } catch (error) {
            alert(error?.response?.data?.message ?? error.toString());
          }
        }
      );
    } else {
      try {
        await GenerosService.Agregar(item);
        await Buscar();
        Volver();
        setTimeout(() => {
          alert("Género agregado.");
        }, 0);
      } catch (error) {
        alert(error?.response?.data?.message ?? error.toString());
      }
    }
  }

  function Volver() {
    setValue("AccionABMC", "L");
  }

  return (
    <div>
      <div className="tituloPagina">
        Generos <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      {AccionABMC === "L" && (
        <div>
          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar por Nombre Género"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-secondary"
              onClick={BuscarGenerosPorNombre}
            >
              Buscar
            </button>
          </div>

          <button className="btn btn-primary mb-3" onClick={Agregar}>
            Agregar
          </button>
          <GenerosListado
            Items={Items}
            Consultar={Consultar}
            Modificar={Modificar}
            Eliminar={Eliminar}
          />
        </div>
      )}

      {AccionABMC !== "L" && (
        <GenerosRegistro
          AccionABMC={AccionABMC}
          Item={Item}
          Grabar={Grabar}
          Volver={Volver}         
          
        />
      )}
    </div>
  );
}

export { Generos };