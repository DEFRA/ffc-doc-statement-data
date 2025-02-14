module.exports = (sequelize, DataTypes) => {
  const etlStageAppsPaymentNotification = sequelize.define('etlStageAppsPaymentNotification', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    application_id: DataTypes.INTEGER,
    id_clc_header: DataTypes.INTEGER,
    notification_dt: DataTypes.DATE,
    notification_flag: DataTypes.STRING,
    notifier_key: DataTypes.DECIMAL,
    notification_text: DataTypes.STRING,
    invoice_number: DataTypes.STRING,
    request_invoice_number: DataTypes.STRING,
    pillar: DataTypes.STRING,
    delivery_body_code: DataTypes.STRING,
    payment_preference_currency: DataTypes.STRING
  },
  {
    tableName: 'etl_stage_apps_payment_notification',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageAppsPaymentNotification
}
