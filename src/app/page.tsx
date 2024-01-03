import Link from "next/link";

const SplashPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md md:py-40 text-center  py-[100px] px-10 ">
        <div
          className="font-semibold text-[40px] md:py-2 py-8 text-center leading-normal"
          style={{
            WebkitTextStroke: "1px #000000",
            fontFamily: "Kanit-Semibold, Helvetica",
          }}
        >
          <h1>General Election Voting</h1>
        </div>
        <div>
          <Link href={"/"}>
            <button className="md:w-[369px] md:h-[90px] w-[200px] h-[50px] bg-button rounded-[20px] shadow-lg mb-7 hover:bg-[#D7DDE6] transition-colors duration-200 ease-in-out">
              Login
            </button>
          </Link>
        </div>
        <Link href={"/"}>
          <button className="md:w-[369px] md:h-[90px] w-[200px] h-[50px] bg-button rounded-[20px] shadow-lg mb-3 hover:bg-[#D7DDE6] transition-colors duration-200 ease-in-out">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SplashPage;
