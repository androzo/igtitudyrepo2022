import Container from "@material-ui/core/Container";
import { useEffect, useState } from "react";
import { getDespesasEndpoint, IDespesa, IUser } from "../services/api";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DespesasTable from "../components/DespesasTable";
import DespesasSelect from "../components/DespesasSelect";
import { Link } from "react-router-dom";
import DespesasHeader from "../components/DespesasHeader";
import DespesasTab from "../components/DespesasTab";
import { Box } from "@material-ui/core";

interface IDespesasPageProps {
  user: IUser;
  onSignOut: () => void;
}

export default function DespesasPage(props: IDespesasPageProps) {
  const { user, onSignOut } = props;
  const params = useParams<{ year: string; month: string }>();
  const [despesas, setDespesas] = useState<IDespesa[]>([]);
  const [year, setYear] = useState(params.year);
  const [month, setMonth] = useState(params.month);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  const onYearChange = (value: string) => {
    setYear(value);
    return <Link to={`${year}-${value}`}></Link>;
  };

  const onMonthChange = (value: string) => {
    setMonth(value);
    return <Link to={`${value}-${month}`}></Link>;
  };

  function popError() {
    return toast.error(
      "Nenhuma despesa encontrada para esta data! Tente outra data",
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  }

  useEffect(() => {
    let sumTotalExpenses: number = 0;
    getDespesasEndpoint(year, month).then((response) => {
      response.map((despesa) => {
        sumTotalExpenses = sumTotalExpenses + despesa.valor;
        despesa.dia = +despesa.dia;
        return true;
      });
      setDespesas(response.sort((a, b) => a.dia - b.dia));
      setTotalExpenses(sumTotalExpenses);

      if (response.length === 0) {
        popError();
      }
    });
  }, [month, year]);

  return (
    <div>
      <Container component="div" maxWidth="md">
        <DespesasHeader user={user} onSignOut={onSignOut} />
      </Container>
      <Container component="div" maxWidth="md">
        <DespesasSelect
          month={month}
          year={year}
          totalExpenses={totalExpenses}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
        />
      </Container>
      <Container component="div" maxWidth="md">
        <DespesasTab despesas={despesas} />
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
