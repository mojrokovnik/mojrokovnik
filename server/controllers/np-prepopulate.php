<?php

require_once 'np-connect.php';
require_once 'np-database.php';

function usersCreateTable($mysqli) {
    $sql = "CREATE TABLE IF NOT EXISTS users (
            user_id                 int(11) NOT NULL AUTO_INCREMENT,
            user_name               varchar(32) CHARACTER SET utf8 NOT NULL,
            user_surname            varchar(32) CHARACTER SET utf8 NOT NULL,
            user_address            varchar(64) CHARACTER SET utf8,
            user_city               varchar(32) CHARACTER SET utf8,
            user_state              varchar(32) CHARACTER SET utf8,
            user_phone              varchar(32) CHARACTER SET utf8,
            user_email              varchar(64) CHARACTER SET utf8 NOT NULL,
            user_accountNumber      varchar(64) CHARACTER SET utf8,
            user_username           varchar(64) CHARACTER SET utf8 NOT NULL,
            user_password           char(128) CHARACTER SET utf8 NOT NULL,
            user_passwordSalt       char(128) CHARACTER SET utf8 NOT NULL,
            user_pictureUrl         varchar(128) CHARACTER SET utf8,
            user_createdDate        timestamp NOT NULL,
            user_editedDate         timestamp NOT NULL,
            user_accountType        varchar(32) CHARACTER SET utf8,
            user_activationCode     varchar(32) CHARACTER SET utf8,
            user_status             int(11),
            user_delete             int(11) DEFAULT 0,
            PRIMARY KEY (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

    exSQL($sql, $mysqli);
}

function loginAttemptsCreateTable($mysqli) {
    $sql = "CREATE TABLE IF NOT EXISTS login_attempts (
            user_id     int(11) NOT NULL,
            time        varchar(30) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

    exSQL($sql, $mysqli);
}

function clientCreateTable($mysqli) {
    $sql = "CREATE TABLE IF NOT EXISTS clients (
            client_id                   int(11) NOT NULL AUTO_INCREMENT,
            user_id                     int(11) NOT NULL,
            client_type                 varchar(32) CHARACTER SET utf8 NOT NULL,
            client_name                 varchar(32) CHARACTER SET utf8 NOT NULL,
            client_surname              varchar(32) CHARACTER SET utf8 NOT NULL,
            client_address              varchar(64) CHARACTER SET utf8,
            client_company              varchar(64) CHARACTER SET utf8,
            client_companyID            varchar(8) CHARACTER SET utf8,
            client_companyTaxNumber     varchar(9) CHARACTER SET utf8,
            client_city                 varchar(32) CHARACTER SET utf8,
            client_state                varchar(32) CHARACTER SET utf8,
            client_citizenship          varchar(64) CHARACTER SET utf8,
            client_phone                varchar(32) CHARACTER SET utf8,
            client_email                varchar(64) CHARACTER SET utf8,
            client_socialNumber         varchar(13) CHARACTER SET utf8,
            client_idNumber             varchar(9) CHARACTER SET utf8,
            client_accountNumber        varchar(64) CHARACTER SET utf8,
            client_comment              varchar(1024) CHARACTER SET utf8,
            client_createdDate          timestamp,
            client_editedDate           timestamp,
            client_delete               int(11) DEFAULT 0,
            PRIMARY KEY (client_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

    exSQL($sql, $mysqli);
}

function caseCreateTable($mysqli) {
    $sql = "CREATE TABLE IF NOT EXISTS cases (
            case_id               int(11) NOT NULL AUTO_INCREMENT,
            user_id               int(11) NOT NULL,
            client_id             int(11) NOT NULL,
            case_type             varchar(32) CHARACTER SET utf8,
            case_number           varchar(32) CHARACTER SET utf8,
            case_element          varchar(32) CHARACTER SET utf8,
            case_name             varchar(64) CHARACTER SET utf8,
            case_rivalType        varchar(32) CHARACTER SET utf8,
            case_rivalName        varchar(32) CHARACTER SET utf8,
            case_rivalSurname     varchar(32) CHARACTER SET utf8,
            case_businessCouncil  varchar(32) CHARACTER SET utf8,
            case_businessLabel    varchar(32) CHARACTER SET utf8,
            case_businessNumber   varchar(32) CHARACTER SET utf8,
            case_supervisor       varchar(32) CHARACTER SET utf8,
            case_courtNo          varchar(32) CHARACTER SET utf8,
            case_judge            varchar(64) CHARACTER SET utf8,
            case_value            varchar(32) CHARACTER SET utf8,
            case_status           varchar(32) CHARACTER SET utf8,
            case_comment          varchar(1024) CHARACTER SET utf8,
            case_createdDate      timestamp,
            case_editedDate       timestamp,
            case_delete           int(11) DEFAULT 0,
            PRIMARY KEY (case_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

    exSQL($sql, $mysqli);
}

function calendarCreateTable($mysqli) {
    $sql = "CREATE TABLE IF NOT EXISTS calendars (
            calendar_id         int(11) NOT NULL AUTO_INCREMENT,
            user_id             int(11) NOT NULL,
            client_id           int(11),
            case_id             int(11),
            calendar_type       int(11) NOT NULL,
            calendar_name       varchar(64) CHARACTER SET utf8 NOT NULL,
            calendar_startDate  timestamp NOT NULL,
            calendar_endDate    timestamp,
            calendar_comment    varchar(1024) CHARACTER SET utf8,
            calendar_delete     int(11) DEFAULT 0,
            PRIMARY KEY (calendar_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

    exSQL($sql, $mysqli);
}

/* ======================================================
  FUNCTIONS FOR DATABASE PREPOPULATION
  ======================================================= */

function userPrepopulate($mysqli) {
    $sql = "INSERT INTO Users (user_name, user_surname, user_address, user_city, user_state, user_phone, user_email, user_accountNumber, user_username, user_password, user_passwordSalt, user_createdDate, user_accountType, user_activationCode, user_status)
            VALUES ('Nemanja', 'Pavlović', 'Generala Štefanika 20', 'Beograd', 'Srbija', '+381 63 715 65 05', 'me@pavlovicnemanja.com', '', 'nemanja.pavlovic', '011cec9b2e604fcfa2af9c0d0ad27cd30b88ab371dd1db13a3d60bb88441912d3ce06223f50cd5d736fed3881254060fd9ce11eecdb76f7b5d0831963663eb76', 'f9aab579fc1b41ed0c44fe4ecdbfcdb4cb99b9023abb241a6db833288f4eea3c02f76e0d35204a8695077dcf81932aa59006423976224be0390395bae152d4ef', '{{registration-date}}', 'superuserr', '', '1')";

    exSQL($sql, $mysqli);
}

function clientPrepopulate($mysqli) {
    $sql = "INSERT INTO Clients (client_name, client_surname, client_address, client_city, client_state, client_citizenship, client_phone, client_email, client_socialNumber, client_idNumber, client_accountNumber, client_comment)
            VALUES ('Nemanja', 'Pavlović', 'Generala Štefanika 20', 'Beograd', 'Srbija', 'Srpsko', '+381 63 715 65 05', 'me@pavlovicnemanja.com', '0911992740046', '', '160-5400100716409-92', '')";

    exSQL($sql, $mysqli);
}

function createBase($mysqli) {
    usersCreateTable($mysqli);
    loginAttemptsCreateTable($mysqli);
    clientCreateTable($mysqli);
    caseCreateTable($mysqli);
    calendarCreateTable($mysqli);

    userPrepopulate($mysqli);
}

createBase($mysqli);
