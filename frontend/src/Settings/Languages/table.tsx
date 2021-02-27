import { faTrash, faWrench } from "@fortawesome/free-solid-svg-icons";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Badge, Button, ButtonGroup } from "react-bootstrap";
import { Column, TableUpdater } from "react-table";
import { useLanguagesProfile } from ".";
import { ActionIcon, BasicTable, useShowModal } from "../../components";
import { useUpdate } from "../components";
import { languageProfileKey } from "../keys";
import Modal from "./modal";
import { anyCutoff } from "./options";

const Table: FunctionComponent = () => {
  const originalProfiles = useLanguagesProfile();

  const [profiles, setProfiles] = useState([...originalProfiles]);

  const nextProfileId = useMemo(
    () =>
      1 +
      profiles.reduce<number>((val, prof) => Math.max(prof.profileId, val), 0),
    [profiles]
  );

  const update = useUpdate();

  const showModal = useShowModal();

  const submitProfiles = useCallback(
    (list: LanguagesProfile[]) => {
      update(list, languageProfileKey);
      setProfiles(list);
    },
    [update]
  );

  const updateProfile = useCallback(
    (profile: LanguagesProfile) => {
      const list = [...profiles];
      const idx = list.findIndex((v) => v.profileId === profile.profileId);

      if (idx !== -1) {
        list[idx] = profile;
      } else {
        list.push(profile);
      }
      submitProfiles(list);
    },
    [profiles, submitProfiles]
  );

  const updateRow = useCallback<TableUpdater<LanguagesProfile>>(
    (row, item?: LanguagesProfile) => {
      if (item) {
        showModal("profile", item);
      } else {
        const list = [...profiles];
        list.splice(row.index, 1);
        submitProfiles(list);
      }
    },
    [submitProfiles, showModal, profiles]
  );

  const columns = useMemo<Column<LanguagesProfile>[]>(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Languages",
        accessor: "items",
        Cell: (row) => {
          const items = row.value;
          const cutoff = row.row.original.cutoff;
          return items.map((v) => {
            const isCutoff = v.id === cutoff || cutoff === anyCutoff;
            return (
              <Badge
                key={v.id}
                className="mx-1"
                title={
                  isCutoff
                    ? "Ignore others if this one is avaliable"
                    : undefined
                }
                variant={isCutoff ? "primary" : "secondary"}
              >
                {v.language}
              </Badge>
            );
          });
        },
      },
      {
        accessor: "profileId",
        Cell: ({ row, update }) => {
          const profile = row.original;

          return (
            <ButtonGroup>
              <ActionIcon
                icon={faWrench}
                onClick={() => {
                  update && update(row, profile);
                }}
              ></ActionIcon>
              <ActionIcon
                icon={faTrash}
                onClick={() => update && update(row)}
              ></ActionIcon>
            </ButtonGroup>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <BasicTable
        showPageControl={false}
        columns={columns}
        data={profiles}
        update={updateRow}
      ></BasicTable>
      <Button
        block
        variant="light"
        onClick={() => {
          const profile = {
            profileId: nextProfileId,
            name: "",
            items: [],
            cutoff: null,
          };
          showModal("profile", profile);
        }}
      >
        Add New Profile
      </Button>
      <Modal update={updateProfile} modalKey="profile"></Modal>
    </React.Fragment>
  );
};

export default Table;