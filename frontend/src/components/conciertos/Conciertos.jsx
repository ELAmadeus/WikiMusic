import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ConciertosListado from "./ConciertosListado";
import ConciertosRegistro from "./ConciertosRegistro";
import { ConciertosService } from "../../services/conciertos.services";
import modalDialogService from "../../services/modalDialog.services";

function Conciertos() {
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
      Artistas: [],
      RegistrosTotal: 0,
      searchTerm: "",
    },
  });

  const AccionABMC = watch("AccionABMC");
  const searchTerm = watch("searchTerm");
  const Items = watch("Items");
  const Item = watch("Item");
  const Artistas = watch("Artistas");

  useEffect(() => {
    Buscar();
    BuscarArtistas();
  }, []);

  async function Buscar() {
    modalDialogService.BloquearPantalla(true);
    try {
      const data = await ConciertosService.Buscar();
      modalDialogService.BloquearPantalla(false);
      setValue("Items", data);
      setValue("RegistrosTotal", data.length);
    } catch (error) {
      console.error("Error al buscar:", error);
    }
  }

  async function BuscarArtistas() {
    try {
      const data = await ConciertosService.BuscarArtistas();
      setValue("Artistas", data);
    } catch (error) {
      console.log("¡Error! No se pudo buscar datos de artistas en el servidor.");
    }
  }

  async function BuscarConciertosPorNombre() {
    if (searchTerm.trim() === "") {
      return Buscar();
    }
    try {
      const data = await ConciertosService.BuscarPorNombre(searchTerm);
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
      const data = await ConciertosService.BuscarPorId(item);
      setValue("Item", data);
      setValue("AccionABMC", accionABMC);
    } catch (error) {
      console.error("Error al buscar por ID:", error);
      alert("¡Error! No se pudo obtener los detalles del sello.");
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

  async function Eliminar(IdConcierto) {
    modalDialogService.Confirm(
      "¿Está seguro que desea eliminar este concierto?",
      undefined,
      undefined,
      undefined,
      async () => {
        await ConciertosService.Eliminar(IdConcierto);
        await Buscar();
      }
    );
  }

  async function Grabar(item) {
    try {
      if (AccionABMC === "A") {
        await ConciertosService.Agregar(item);
      } else {
        await ConciertosService.Modificar(item);
      }
      await Buscar();
      Volver();
      setTimeout(() => {
        alert(
          "Concierto " +
            (AccionABMC === "A" ? "agregado" : "modificado")
        );
      }, 0);
    } catch (error) {
      alert(error?.response?.data?.message ?? error.toString());
    }
  }

  function Volver() {
    setValue("AccionABMC", "L");
  }

  return (
    <div>
      <div className="tituloPagina">
        Conciertos <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      {AccionABMC === "L" && (
        <div>
          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar por Nombre Concierto"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-secondary"
              onClick={BuscarConciertosPorNombre}
            >
              Buscar
            </button>
          </div>

          <button className="btn btn-primary mb-3" onClick={Agregar}>
            Agregar
          </button>
          <ConciertosListado
            Items={Items}
            Consultar={Consultar}
            Modificar={Modificar}
            Eliminar={Eliminar}
          />
        </div>
      )}

      {AccionABMC !== "L" && (
        <ConciertosRegistro
          AccionABMC={AccionABMC}
          Item={Item}
          Grabar={Grabar}
          Volver={Volver}
          Artistas={Artistas}
        />
      )}
    </div>
  );
}

export  {Conciertos};