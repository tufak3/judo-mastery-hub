  return (
    <div className="admin-page">
      <h2>Управление курсами</h2>
      
      {loading && <div className="status-message info">Загрузка данных...</div>}
      
      {error && (
        <div className="status-message error">
          Ошибка: {error}
        </div>
      )}
      
      {operationStatus && (
        <div className={`status-message ${operationStatus.type}`}>
          {operationStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form"> 