import React, { useState, useEffect } from "react";
import { SellosService } from "../../services/sellos.services";
import SellosListado from "./SellosListado";
import SellosRegistro from "./SellosRegistro";
import modalDialogService from "../../services/modalDialog.services";
import { useForm } from "react-hook-form";

function Sellos() {
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
    BuscarSellos();
  }, []);

  async function BuscarSellos() {
    modalDialogService.BloquearPantalla(true);
    try {
      const data = await SellosService.Buscar();
      modalDialogService.BloquearPantalla(false);
      setValue("Items", data);
      setValue("RegistrosTotal", data.length);
    } catch (error) {
      console.error("Error al buscar:", error);
    }
  }

  async function BuscarSellosPorNombre() {
    if (searchTerm.trim() === "") {
      return BuscarSellos();
    }
    try {
      const data = await SellosService.BuscarPorNombre(searchTerm);
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
      const data = await SellosService.BuscarPorId(item);
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

  async function Eliminar(IdSello) {
    modalDialogService.Confirm(
      "¿Está seguro que desea eliminar este sello? Si lo hace, los artistas asociados a este sello tendrán el campo sello como Sin sello.",
      undefined,
      undefined,
      undefined,
      async () => {
        await SellosService.Eliminar(IdSello);
        await BuscarSellos();
      }
    );
  }

  async function Grabar(item) {
    if (AccionABMC === "M") {
      modalDialogService.Confirm(
        "¿Está seguro que desea modificar este Sello? Si lo hace, también se modificará el artista asociado si es que tiene.",
        undefined,
        undefined,
        undefined,
        async () => {
          try {
            await SellosService.Modificar(item);
            await BuscarSellos();
            Volver();
            setTimeout(() => {
              alert("Sello modificado.");
            }, 0);
          } catch (error) {
            alert(error?.response?.data?.message ?? error.toString());
          }
        }
      );
    } else {
      try {
        await SellosService.Agregar(item);
        await BuscarSellos();
        Volver();
        setTimeout(() => {
          alert("Sello agregado.");
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
        Sellos <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      {AccionABMC === "L" && (
        <div>
          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-secondary"
              onClick={BuscarSellosPorNombre}
            >
              Buscar
            </button>
          </div>

          <button
            className="btn btn-primary mb-3"
            onClick={Agregar}
          >
            Agregar
          </button>
          <SellosListado
            Items={Items}
            Consultar={Consultar}
            Modificar={Modificar}
            Eliminar={Eliminar}
          />
        </div>
      )}

      {AccionABMC !== "L" && (
        <SellosRegistro
          AccionABMC={AccionABMC}
          Item={Item}
          Grabar={Grabar}
          Volver={Volver}
        />
      )}
    </div>
  );
}

export { Sellos };