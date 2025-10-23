export default function Home() {
  return (
    <div className="flex pitems-center justify-center">
      <main>
        <div style={{ padding: "100px" }}></div>
        <h1 className="text-4xl font-bold">
          This is the place where PolyLend will live
        </h1>
        <div style={{ padding: "50px" }}></div>
        <p className="text-lg">
          CA:
          <a
            className="text-blue-500"
            href="https://dexscreener.com/solana/7ernkhxegyj5vsy26mzeeyevzpdksrgp1dx3ugt9mmph"
          >
            7ernkhxegyj5vsy26mzeeyevzpdksrgp1dx3ugt9mmph
          </a>
        </p>
        <p>
          GH:
          <a className="text-blue-500" href="https://github.com/poly-lend/">
            https://github.com/poly-lend/
          </a>
        </p>
        <p>
          TG:{" "}
          <a className="text-blue-500" href="https://t.me/poly_lend">
            @poly_lend
          </a>
        </p>
        <p>
          X:{" "}
          <a className="text-blue-500" href="https://x.com/poly_lend">
            @poly_lend
          </a>
        </p>
      </main>
    </div>
  );
}
