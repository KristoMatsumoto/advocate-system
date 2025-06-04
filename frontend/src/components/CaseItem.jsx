export default function CaseItem({ caseData }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title">{caseData.title}</h5>
        <p className="card-text text-muted">{caseData.description}</p>
        <button className="btn btn-sm btn-outline-primary">Подробнее</button>
      </div>
    </div>
  );
};
