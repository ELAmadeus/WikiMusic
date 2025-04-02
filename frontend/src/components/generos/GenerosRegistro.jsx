import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function GenerosRegistro({
  AccionABMC,  
  Item,
  Grabar,
  Volver,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors},
  } = useForm({ defaultValues: Item });

  useEffect(() => {
    if (AccionABMC === "A" ) {
      setValue("Nombre", "");
      setValue("Descripcion", "");
      setValue("Popularidad", 0);
      setValue("FechaCreacion", "");
    }
  }, [AccionABMC, setValue]);  

  useEffect(() => {
    if (AccionABMC !== "A" && Item) {
      setValue("Nombre", Item.Nombre);
      setValue("Descripcion", Item.Descripcion);
      setValue("Popularidad", Item.Popularidad);
      setValue("FechaCreacion", new Date(Item.FechaCreacion).toISOString().split('T')[0]);
      
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
          Nombre del Genero <span className="text-danger">*</span>:
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

      {/* Campo Descripcion */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="Descripcion">
          Descripcion <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="text"
            name="Descripcion"
            className="form-control"
            placeholder="Descripcion"
            {...register("Descripcion", { required: "Este campo es obligatorio" })}
          />
          {errors.Descripcion && (
            <div className="text-danger">{errors.Descripcion.message}</div>
          )}
        </div>
      </div>

      {/* Campo Popularidad */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="Popularidad">
          Popularidad <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="number"
            name="Popularidad"
            className="form-control"
            placeholder="Popularidad"
            {...register("Popularidad", {
              required: "Este campo es obligatorio",
              min: { value: 0, message: "No puede ser un número negativo" }
            })}
          />
          {errors.Popularidad && (
            <div className="text-danger">{errors.Popularidad.message}</div>
          )}
        </div>
      </div>

      {/* Campo FechaCreacion */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="FechaCreacion">
        FechaCreacion <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="date"
            name="FechaCreacion"
            className="form-control"
            {...register("FechaCreacion", {
              required: "Este campo es obligatorio",
              validate: (value) => {
                const fechaIngresada = new Date(value);
                const fechaActual = new Date();
                return fechaIngresada <= fechaActual || "La fecha no puede ser mayor a la actual";
              }
            })}
          />
          {errors.FechaCreacion && (
            <div className="text-danger">{errors.FechaCreacion.message}</div>
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