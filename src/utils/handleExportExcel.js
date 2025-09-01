const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';
const DISBURSEMENT_API_ROUTE = 'http://localhost:3000/api/disbursement';

export const fetchReimbursementRequest = async ({ token, param = '' }) => {
  try {
    const res = await fetch(REIMBURSEMENT_API_ROUTE + '/export' + param.trim(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("無法生成請款單：" + errorText);
    }

    if (res.status === 204) {
      throw new Error("沒有可導出的結清款項");
    }

    const blob = await res.blob();
    const contentDisposition = res.headers.get('Content-Disposition');
    let filename = '請款單.xlsx';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  } catch (err) {
    console.error('下載 Excel 錯誤:', err);
    throw err;
  }
}

export const fetchRequestRecordExcel = async ({ token, param = '' }) => {
  try {
    const res = await fetch(DISBURSEMENT_API_ROUTE + '/export' + param.trim(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("無法生成請款紀錄表：" + errorText);
    }

    if (res.status === 204) {
      throw new Error("沒有可導出的請款紀錄款項");
    }

    const blob = await res.blob();
    const contentDisposition = res.headers.get('Content-Disposition');
    let filename = '請款紀錄表.xlsx';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  } catch (err) {
    console.error('下載 Excel 錯誤:', err);
    throw err;
  }
}