// pages/CasesPage.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import CaseForm from '../components/CaseForm';
import CaseItem from '../components/CaseItem';
import CaseModal from '../components/CaseModal'

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [meta, setMeta] = useState({ total_pages: 1 });

  const fetchCases = () => {
    api.get('/cases', {
      params: { query, page, per_page: perPage }
    })
    .then(res => {
      setCases(res.data.cases);
      setMeta(res.data.meta);
    })
    .catch(err => console.error(err.message))
  }

  useEffect(() => { fetchCases(); }, [query, page])

//   const handleNewCase = () => {
//     setPage(1)
//     fetchCases()
//   }

  return (
    <div className="container py-4">
      <h2 className="mb-4">📁 Sprawy</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Dodaj nowa sprawe</h5>
          <CaseForm onCreate={fetchCases} />
        </div>
      </div>

      <div className="input-group mb-4">
        <span className="input-group-text"><i className="bi bi-search" /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Wyszukaj po nazwie"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setPage(1)
          }}
        />
      </div>

      <div className="row">
        {cases.length > 0 ? (
          cases.map(c => (
            <div key={c.id} className="col-md-6 mb-3">
              <CaseItem caseData={c} />
            </div>
          ))
        ) : (
          <div className="text-muted">Nie ma spraw</div>
        )}
      </div>

      {meta.total_pages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: meta.total_pages }, (_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
};
