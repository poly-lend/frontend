export default function LoansTable({ address }: { address?: `0x${string}` }) {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">
          LoansTable
        </h2>
      </div>
      <div>LoansTable for {address}</div>
    </div>
  );
}
