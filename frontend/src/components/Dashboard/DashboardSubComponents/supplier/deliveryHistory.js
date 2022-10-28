import { Button, Table } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect } from "react";

function onChange(pagination, filters, sorter, extra) {
  console.log("params", pagination, filters, sorter, extra);
}

const Delivery = () => {
  const doc = new jsPDF("p", "pt", "a2");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    (async () => {
      await fetch("/order")
        .then((res) => res.json())
        .then((json) => {
          setData(json);
          setLoader(!loader);
        });
    })();
  }, []);

  const filteredData = data.filter(
    (el) =>
      el?.status !== null && el?.supEmail === localStorage.getItem("email")
  );
  console.log(filteredData);

  const columns = [
    {
      title: "Item Name",
      dataIndex: "name",
      sorter: (a, b) => a.name - b.name,
      sortDirections: ["descend"],
    },
    {
      title: "Unit",
      dataIndex: "unit",
      sorter: (a, b) => a.Unit - b.Unit,
    },
    {
      title: "Store Name",
      dataIndex: "nameOfSupplier",
      sorter: (a, b) => a.nameOfSupplier - b.nameOfSupplier,
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      sorter: (a, b) => a.contactPerson - b.contactPerson,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity.length - b.quantity.length,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
    },
    {
      title: "Budget",
      dataIndex: "sBudget",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const print = () => {
    autoTable(doc, {
      head: [
        [
          "name",
          "unit",
          "nameOfSupplier",
          "contactPerson",
          "phoneNumber",
          "quantity",
          "unitPrice",
          "sBudget",
          "Status",
        ],
      ],
      theme: "grid",
      body: filteredData.map((val) => [
        val?.name,
        val?.unit,
        val?.nameOfSupplier,
        val?.contactPerson,
        val?.phoneNumber,
        val?.quantity,
        val?.unitPrice,
        val?.sBudget,
        val?.status,
      ]),
    });

    doc.save(`deliver_${new Date()}.pdf`);
  };

  return (
    <>
      <Button style={{ float: "right" }} onClick={print}>
        Generate Report
      </Button>
      <br /> <br />
      <Table
        columns={columns}
        dataSource={filteredData}
        onChange={onChange}
        loading={loader}
        showHeader
        sticky
      />
    </>
  );
};

export default Delivery;