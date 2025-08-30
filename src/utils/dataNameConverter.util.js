export function convertRoleName (rawRole) {
  switch (rawRole) {
    case 'member':
      return '一般用戶';
    case 'manager':
      return '財務管理員';
    case 'admin':
      return '系統管理員';
    default :
      return 'Unknown Role'
  }
}

export function convertRequestStatusName (rawStatus) {
  switch (rawStatus) {
    case 'pending':
      return '審查中';
    case 'approved':
      return '已審核通過';
    case 'rejected':
      return '審核不通過';
    case 'settled':
      return '已結清';
    default :
      return 'Unknown Status'
  }
}