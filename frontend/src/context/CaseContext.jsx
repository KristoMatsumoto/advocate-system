import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const CaseContext = createContext();

export function CaseProvider({ id, children }) {
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCase = async () => {
        setLoading(true);
        
        api.get(`/cases/${id}`)
            .then(res => { setCaseData(res.data); setError(""); })
            .catch((err) => setError("Could not load case data"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (id) fetchCase();
    }, []);

    const updateCaseData = (updated) => {
        setCaseData((prev) => ({ ...prev, ...updated }));
    };

    return (
        <CaseContext.Provider value={{ caseData, updateCaseData, loading, error, fetchCase }}>
            {!loading && children}
        </CaseContext.Provider>
    );
}
