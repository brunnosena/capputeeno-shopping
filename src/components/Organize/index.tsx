import React, { useState } from "react";

import { Container } from "./styles";
import { FiChevronDown } from "react-icons/fi";
import { useGlobalState } from "../../hooks/stateGlobal";
import { useCallback } from "react";

export function Organize() {
  const [open, setOpen] = useState(false);
  const { setStateGlobal } = useGlobalState();

  const handleOrganize = useCallback(
    (sort, order) => {
      setStateGlobal({ sort, order });
      setOpen(false);
    },
    [setStateGlobal]
  );

  return (
    <div>
      <Container>
        <div onClick={() => setOpen(!open)}>
          <p>Organizar por</p>
          <FiChevronDown />
        </div>
        {open && (
          <div className="organizeOptions">
            <p onClick={() => handleOrganize("", "")}>Novidades</p>
            <p onClick={() => handleOrganize("price", "desc")}>
              Preço: Maior - menor
            </p>
            <p onClick={() => handleOrganize("price", "asc")}>
              Preço: Menor - maior
            </p>
            <p onClick={() => handleOrganize("", "")}>Mais vendidos</p>
          </div>
        )}
      </Container>
    </div>
  );
}