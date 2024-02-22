export default function CitySearch() {
  return (
    <div className="hero mt-8 py-4">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Trail Weather</h1>
          <p className="py-3">
            Search a city to begin planning your next trail adventure!
          </p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">City Search</span>
              </label>
              <input
                type="text"
                placeholder="Boulder, CO"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Send it</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
