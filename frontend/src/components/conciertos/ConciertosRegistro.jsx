import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ConciertosRegistro({AccionABMC, Artistas, Item, Grabar, Volver,}) {
  const {register, handleSubmit, setValue, formState: { errors}} = useForm({
     defaultValues: Item });

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (AccionABMC !== "A" && Item) {
      setValue("Nombre", Item.Nombre);
      setValue("Fecha", new Date(Item.Fecha).toISOString().split('T')[0]);
      setValue("Lugar", Item.Lugar);
      setValue("ArtistaId", Item.ArtistaId);
      setValue("DuracionMinutos", Item.DuracionMinutos);
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

  return (
    <form className="container-fluid" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-center mb-4">
        {AccionABMC === "A" ? "Agregar Concierto" : "Modificar Concierto"}
      </h3>

      {/* Campo Nombre */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="Nombre">
          Nombre del concierto <span className="text-danger">*</span>:
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

      {/* Campo Fecha */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="Fecha">
          Fecha <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="date"
            name="Fecha"
            className="form-control"
            {...register("Fecha", {
              required: "Este campo es obligatorio",
              validate: (value) => {
                const fechaIngresada = new Date(value);
                const fechaActual = new Date();
                //return fechaIngresada <= fechaActual || "La fecha no puede ser mayor a la actual";
              }
            })}
          />
          {errors.Fecha && (
            <div className="text-danger">{errors.Fecha.message}</div>
          )}
        </div>
      </div>

      {/* Campo Lugar */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="Lugar">
          Lugar <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="text"
            name="Lugar"
            className="form-control"
            placeholder="Lugar"
            {...register("Lugar", { required: "Este campo es obligatorio" })}
          />
          {errors.Lugar && (
            <div className="text-danger">{errors.Lugar.message}</div>
          )}
        </div>
      </div>

      {/* Campo ArtistaId */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="ArtistaId">
          Artista <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <select
            name="ArtistaId"
            className="form-control"
            {...register("ArtistaId", { required: "Este campo es obligatorio" })}
          >
            <option value="">Seleccione un artista</option>
            {Artistas.map((artista) => (
              <option key={artista.IdArtista} value={artista.IdArtista}>{artista.Nombre}</option>
            ))}
          </select>
          {errors.ArtistaId && (
            <div className="text-danger">{errors.ArtistaId.message}</div>
          )}
        </div>
      </div>

      {/* Campo DuracionMinutos */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="DuracionMinutos">
          Duración en minutos <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="number"
            name="DuracionMinutos"
            className="form-control"
            placeholder="Duración en minutos"
            {...register("DuracionMinutos", {
              required: "Este campo es obligatorio",
              min: { value: 0, message: "No puede ser un número negativo" }
            })}
          />
          {errors.DuracionMinutos && (
            <div className="text-danger">{errors.DuracionMinutos.message}</div>
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