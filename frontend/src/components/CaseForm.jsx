import { useState } from 'react';
import api from '../api/axios';

const CaseForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    court: '',
    case_number: '',
    start_date: '',
    end_date: '',
    client_name: '',
  })

  const handleSubmit = (e) => {
    console.log(formData)
    e.preventDefault();
    api.post('/cases', formData)
      .then(res => {
        setFormData({
          title: '',
          description: '',
          court: '',
          case_number: '',
          start_date: '',
          end_date: '',
          client_name: '',
        })
        if (onCreate) onCreate();
      })
      .catch(err => console.error(err.message));
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="mb-2">
            <label className="form-label">Tytul</label>
            <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Название дела"
                value={formData.title}
                onChange={handleChange}
                required
            />
        </div>
        <div className="col-md-6">
            <label className="form-label">Numer sprawy</label>
            <input
                type="text"
                name="case_number"
                className="form-control"
                value={formData.case_number}
                onChange={handleChange}
                required
            />
        </div>
        <div className="mb-2">
            <label className="form-label">Opis</label>
            <textarea
                name="description"
                className="form-control"
                placeholder="Opis"
                rows="3"
                value={formData.description}
                onChange={handleChange}
            />
        </div>
        <div className="mb-2">
            <textarea
                name="court"
                className="form-control"
                placeholder="Sad"
                rows="3"
                value={formData.court}
                onChange={handleChange}
            />
        </div>
        <div>
            <div className="col-md-6">
                <label className="form-label">Клиент</label>
                <input
                    type="text"
                    name="client_name"
                    className="form-control"
                    value={formData.client_name}
                    onChange={handleChange}
                    required
                />
            </div>
        </div>

        <div className="row mb-3">
            <div className="col-md-6">
                <label className="form-label">Дата начала</label>
                <input
                    type="date"
                    name="start_date"
                    className="form-control"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="col-md-6">
                <label className="form-label">Дата окончания</label>
                <input
                    type="date"
                    name="end_date"
                    className="form-control"
                    value={formData.end_date}
                    onChange={handleChange}
                />
            </div>
        </div>
        <button className="btn btn-success">Создать</button>
    </form>
  );
};

export default CaseForm;
