import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SellosRegistro({ AccionABMC, Item, Grabar, Volver }) {
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: Item});

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (AccionABMC !== "A" && Item) {
      setValue("Nombre", Item.Nombre);
      setValue("Pais", Item.Pais);
      setValue("FechaFundacion", new Date(Item.FechaFundacion).toISOString().split('T')[0]);
      setValue("ArtistasFirmados", Item.ArtistasFirmados);
    }
  }, [AccionABMC, Item, setValue]);


  const onSubmit = async (data) => {
    try {
      console.log(data);
      await Grabar(data);
      
    } catch (error) {
      console.error(error.message);
    }
  };

  const paises = ["Estados Unidos", "Reino Unido", "Colombia", "México", "Cuba", "Puerto Rico", "España"];

  return (
    <form className="container-fluid" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-center mb-4">
        {AccionABMC === "A" ? "Agregar Sello" : "Modificar Sello"}
      </h3>

      {/* Campo Nombre */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="Nombre">
          Nombre del sello <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="text"
            name="Nombre"
            className="form-control"
            placeholder="Nombre"
            {...register("Nombre", { required: "Este campo es obligatorio" })}
          />
          {errors.Nombre && (
            <div className="text-danger">{errors.Nombre.message}</div>
          )}
        </div>
      </div>

      {/* Campo País */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="Pais">
          País <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <select
            name="Pais"
            className="form-control"
            {...register("Pais", { required: "Este campo es obligatorio" })}
          >
            <option value="">Seleccione un país</option>
            {paises.map((pais) => (
              <option key={pais} value={pais}>{pais}</option>
            ))}
          </select>
          {errors.Pais && (
            <div className="text-danger">{errors.Pais.message}</div>
          )}
        </div>
      </div>

      {/* Campo Fecha de Fundación */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="FechaFundacion">
          Fecha de Fundación <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="date"
            name="FechaFundacion"
            className="form-control"
            {...register("FechaFundacion", {
              required: "Este campo es obligatorio",
              validate: (value) => {
                const fechaIngresada = new Date(value);
                const fechaActual = new Date();
                return fechaIngresada <= fechaActual || "La fecha no puede ser mayor a la actual";
              }
            })}
          />
          {errors.FechaFundacion && (
            <div className="text-danger">{errors.FechaFundacion.message}</div>
          )}
        </div>
      </div>

      {/* Campo Artistas Firmados */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="ArtistasFirmados">
          Artistas Firmados <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="number"
            name="ArtistasFirmados"
            className="form-control"
            placeholder="Artistas Firmados"
            {...register("ArtistasFirmados", {
              required: "Este campo es obligatorio",
              min: { value: 0, message: "No puede ser un número negativo" }
            })}
          />
          {errors.ArtistasFirmados && (
            <div className="text-danger">{errors.ArtistasFirmados.message}</div>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="row justify-content-center">
        <div className="col text-center">
          <button
            type="submit"
            className="btn btn-primary me-3"
          >
            {AccionABMC === "A" ? "Agregar" : "Guardar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={Volver}
          >
            {AccionABMC === "A" ? "Cancelar" : "Volver"}
          </button>
        </div>
      </div>
    </form>
  );
}
