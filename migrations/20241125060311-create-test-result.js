'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('test_result', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'project',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('SUCCESS', 'FAILED', 'ERROR'),
        allowNull: false
      },
      codeQuality: {
        type: Sequelize.JSON,
        allowNull: true
      },
      securityIssues: {
        type: Sequelize.JSON,
        allowNull: true
      },
      performanceMetrics: {
        type: Sequelize.JSON,
        allowNull: true
      },
      testSummary: {
        type: Sequelize.JSON,
        allowNull: true
      },
      executionDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      commitInfo: {
        type: Sequelize.JSON,
        allowNull: true
      },
      executionLogs: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Agregar índices para mejor rendimiento
    await queryInterface.addIndex('test_result', ['projectId']);
    await queryInterface.addIndex('test_result', ['executionDate']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('test_result');
  }
};
