import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function BiografiasRegistro({
  AccionABMC,
  Artistas,
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
      setValue("Historia", "");
      setValue("ArtistaId", "");
      setValue("Wikipedia", "")
    }
  }, [AccionABMC, setValue]);  

  useEffect(() => {
    if (AccionABMC !== "A" && Item) {
      setValue("Historia", Item.Historia);
      setValue("ArtistaId", Item.ArtistaId)
      setValue("Wikipedia", Item.Wikipedia)
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
        {AccionABMC === "A" ? "Agregar Biografia" : "Modificar Biografia"}
      </h3>

      {/* Campo Historia */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="Historia">
          Historia <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="text"
            name="Historia"
            className="form-control"
            placeholder="Historia"
            {...register("Historia", { required: "Este campo es obligatorio" })}
          />
          {errors.Historia && (
            <div className="text-danger">{errors.Historia.message}</div>
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

      {/* Campo Wikipedia */}
      <div className="row mb-3">
        <label className="col-sm-4 col-md-3 col-form-label text-light" htmlFor="Wikipedia">
        Wikipedia <span className="text-danger">*</span>:
        </label>
        <div className="col-sm-8 col-md-6">
          <input
            type="text"
            name="Wikipedia"
            className="form-control"
            placeholder="Wikipedia"
            {...register("Wikipedia", { required: "Este campo es obligatorio" })}
          />
          {errors.Wikipedia && (
            <div className="text-danger">{errors.Wikipedia.message}</div>
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