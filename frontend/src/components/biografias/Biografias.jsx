import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import BiografiasListado from "./BiografiasListado";
import BiografiasRegistro from "./BiografiasRegistro";
import { BiografiasService } from "../../services/biografias.services";
import modalDialogService from "../../services/modalDialog.services";

function Biografias() {
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
      const data = await BiografiasService.Buscar(searchTerm);
      modalDialogService.BloquearPantalla(false);
      setValue("Items", data);
      setValue("RegistrosTotal", data.length);
    } catch (error) {
      console.error("Error al buscar:", error);
    }
  }

  async function BuscarArtistas() {
    try {
      const data = await BiografiasService.BuscarArtistas();
      setValue("Artistas", data);
    } catch (error) {
      console.log("¡Error! No se pudo buscar datos de artistas en el servidor.");
    }
  }

  function handleSearchChange(e) {
    setValue("searchTerm", e.target.value);
  }

  async function BuscarPorId(item, accionABMC) {
    try {
      const data = await BiografiasService.BuscarPorId(item);
      setValue("Item", data);
      setValue("AccionABMC", accionABMC);
    } catch (error) {
      console.error("Error al buscar por ID:", error);
      alert("¡Error! No se pudo obtener los detalles de la biografía.");
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

  async function Eliminar(Id) {
    modalDialogService.Confirm(
      "¿Está seguro que desea eliminar esta biografía?",
      undefined,
      undefined,
      undefined,
      async () => {
        await BiografiasService.Eliminar(Id);
        await Buscar();
      }
    );
  }

  async function Grabar(item) {
    try {
      if (AccionABMC === "A") {
        await BiografiasService.Agregar(item);
      } else {
        await BiografiasService.Modificar(item);
      }
      await Buscar();
      Volver();
      setTimeout(() => {
        alert(
          "Biografía " +
            (AccionABMC === "A" ? "agregada" : "modificada")
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
      Biografias <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>
      
      {AccionABMC === "L" && (
        <div>
          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar por nombre de artista"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-secondary"
              onClick={Buscar}
            >
              Buscar
            </button>
          </div>
          <button className="btn btn-primary mb-3" onClick={Agregar}>
            Agregar
          </button>
          <BiografiasListado
            Items={Items}
            Consultar={Consultar}
            Modificar={Modificar}
            Eliminar={Eliminar}
          />
        </div>
      )}

      {AccionABMC !== "L" && (
        <BiografiasRegistro
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

export { Biografias };