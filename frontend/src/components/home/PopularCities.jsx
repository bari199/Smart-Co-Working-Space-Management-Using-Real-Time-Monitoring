import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const cities = [
  {
    name: "Bengaluru",
    size: "large",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Delhi",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Pune",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Gurgaon",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=700&q=80",
  },
];

const PopularCities = () => {
  return (
    <section className="section-padding bg-[var(--background)]">
      <div className="container-width">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">Explore by location</p>

            <h2 className="section-title mt-2">
              India's most popular
              <span className="text-[var(--secondary)]">
                {" "}
                work destinations.
              </span>
            </h2>
          </div>

          <Link
            to="/spaces"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--secondary)]"
          >
            View all cities
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid auto-rows-[190px] grid-cols-2 gap-3 md:grid-cols-4">
          {cities.map((city, index) => (
            <Link
              key={city.name}
              to={`/spaces?city=${city.name}`}
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
                <span className="text-base font-bold text-white">
                  {city.name}
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
