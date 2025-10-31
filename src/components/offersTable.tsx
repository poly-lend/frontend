export default function OffersTable({ address }: { address?: `0x${string}` }) {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">
          OffersTable
        </h2>
      </div>
      <div>OffersTable for {address}</div>
    </div>
  );
}
