<?php

header('Content-Type: application/json');

/*
 * Executes clean sql scripts
 * 
 * $param {string} $sql
 */

function exSQL($sql, $mysqli) {
    $mysqli->query('SET NAMES utf8');

    if ($mysqli->query($sql) === TRUE) {
        echo json_encode(array('msg' => 'Total rows updated: ' . $mysqli->affected_rows));
    } else {
        echo json_encode(array("msg" => 'Error setting database: ' . $mysqli->error));
    }
}

/*
 * Getter for database functions
 * 
 * @param {string} $sql
 */

function getDatabase($sql, $params, $mysqli) {
    if (!empty($params) && is_array($params)) {
        $sql .= ' WHERE ';

        $paramLength = count($params);
        $i = 0;

        foreach ($params as $var => $val) {
            $sql .= $var . ' = "' . $val . '"';

            if ($i !== $paramLength - 1) {
                $sql .= ' AND ';
            }

            $i++;
        }
    }

    $mysqli->query('SET NAMES utf8');

    $result = $mysqli->query($sql);
    $rows = array();

    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    echo json_encode($rows);
}

/*
 * Setter for database functions
 * 
 * @param {string} $sql
 */

function setDatabase($table, $params, $mysqli) {
    if (!empty($params) && is_array($params)) {
        $sql = 'INSERT INTO ' . $table;

        $vars = '';
        $vals = '';

        $paramLength = count($params);
        $i = 0;

        foreach ($params as $var => $val) {
            $vars .= $var;
            $vals .= '"' . $val . '"';

            if ($i !== $paramLength - 1) {
                $vars .= ', ';
                $vals .= ', ';
            }

            $i++;
        }

        $sql .= '(' . $vars . ') VALUES (' . $vals . ')';

        $mysqli->query('SET NAMES utf8');

        if ($mysqli->query($sql) === TRUE) {
            echo json_encode(array(
                'msg' => 'Total rows updated: ' . $mysqli->affected_rows,
                'id' => $mysqli->insert_id
            ));
        } else {
            echo json_encode(array("msg" => 'Error setting database: ' . $mysqli->error));
        }
    }
}

/*
 * Updater for database functions
 * 
 * @param {string} $sql
 */

function updateDatabase($table, $identifier, $controller, $params, $mysqli) {
    if (!empty($params) && is_array($params)) {
        $sql = 'UPDATE ' . $table . ' SET ';

        $paramLength = count($params);
        $i = 0;

        foreach ($params as $var => $val) {
            if ($identifier === $var) {
                $identifier = $var . '="' . $val . '"';
            } else {
                $sql .= $var . '="' . $val . '"';

                if ($i !== $paramLength - 1) {
                    $sql .= ', ';
                }
            }

            $i++;
        }

        $sql .= ' WHERE ' . $identifier . ' AND ' . $controller;

        $mysqli->query('SET NAMES utf8');

        if ($mysqli->query($sql) === TRUE) {
            echo json_encode(array('msg' => 'Total rows updated: ' . $mysqli->affected_rows));
        } else {
            echo json_encode(array("msg" => 'Error setting database: ' . $mysqli->error));
        }
    }
}

/*
 * Deleter for database fuction
 * 
 * @param {string} $sql
 */

function markForDelete($table, $identifier, $controller, $mysqli) {
    if (!empty($identifier)) {
        $flag = substr($identifier, 0, strpos($identifier, '_id')) . '_delete';

        $sql = 'UPDATE ' . $table . ' SET ' . $flag . ' = 1' . ' WHERE ' . $identifier . ' AND ' . $controller;

        $mysqli->query('SET NAMES utf8');

        if ($mysqli->query($sql) === TRUE) {
            echo json_encode(array('msg' => 'Total rows updated: ' . $mysqli->affected_rows));
        } else {
            echo json_encode(array("msg" => 'Error setting database: ' . $mysqli->error));
        }
    }
}
