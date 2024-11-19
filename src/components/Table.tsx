
interface tableProps {
  number: number;
}

const Table: React.FC<tableProps> = ({number}) => {
  return(
    <>
      <div className="h-[calc(100vh/3)] flex flex-col w-full bg-slate-400 rounded-lg text-center items-center justify-center">
        Table {number} 
      </div>
    </>
  )
}
export default Table;