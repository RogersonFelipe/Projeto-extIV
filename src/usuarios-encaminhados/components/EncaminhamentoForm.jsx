import { FieldInput, FieldSelect } from "../../components/ui/FormFields";
import { DateField } from "../../components/ui/DateField";

export function EncaminhamentoForm({ form, formErr, alunos, empresas, handleChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FieldSelect
        label="Aluno"
        icon="school"
        name="alunoId"
        value={form.alunoId}
        onChange={handleChange}
        err={formErr.alunoId}
        span={2}
        options={[
          { value: "", label: "Selecione o aluno..." },
          ...alunos.map((a) => ({ value: String(a.id), label: a.nome })),
        ]}
      />
      <FieldSelect
        label="Empresa"
        icon="business"
        name="empresaId"
        value={form.empresaId}
        onChange={handleChange}
        err={formErr.empresaId}
        span={2}
        options={[
          { value: "", label: "Selecione a empresa..." },
          ...empresas.map((e) => ({ value: String(e.id), label: e.nomeFantasia || e.razaoSocial })),
        ]}
      />
      <DateField
        label="Data de Admissão"
        name="dataAdmissao"
        value={form.dataAdmissao}
        onChange={handleChange}
        err={formErr.dataAdmissao}
      />
      <DateField
        label="Provável Desligamento"
        name="dataDesligamento"
        value={form.dataDesligamento}
        onChange={handleChange}
        err={null}
      />
      <FieldInput
        label="Função"
        icon="work"
        name="funcao"
        value={form.funcao}
        onChange={handleChange}
        placeholder="Cargo / função"
      />
      <FieldInput
        label="Contato RH"
        icon="phone"
        name="contatoRh"
        value={form.contatoRh}
        onChange={handleChange}
        placeholder="Telefone ou e-mail"
      />
    </div>
  );
}
