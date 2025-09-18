function Cadastro_Avaliacao() {
    return(
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Cadastro Avaliação</h2>
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Titulo da Avaliação"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    />
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    >
                        <option value="" disabled selected>Tipo avaliação</option>
                        <option value="aluno-1">Avaliação de experiência</option>
                        <option value="aluno-2">Avaliação de usuário</option>
                    </select>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    >
                        <option value="" disabled selected>Autor avaliação</option>
                        <option value="aluno-1">Professor1</option>
                        <option value="aluno-2">Professor2</option>
                        <option value="aluno-3">Professor3</option>
                    </select>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    >
                        <option value="" disabled selected>Aluno avaliação</option>
                        <option value="aluno-1">Aluno1</option>
                        <option value="aluno-2">Aluno2</option>
                        <option value="aluno-3">Aluno3</option>
                    </select>
                    <input
                        type="date"
                        placeholder="Data inicial"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    />
                    <input
                        type="date"
                        placeholder="Data final"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Cadastrar
                    </button>

                </form>
            </div>
        </div>
    )
}
export default Cadastro_Avaliacao;