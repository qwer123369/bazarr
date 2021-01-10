import React from "react";
import { connect } from "react-redux";
import { Button, Container, Form, Spinner } from "react-bootstrap";

import BasicModal, { ModalProps } from "./BasicModal";

import { LanguageSelector, Selector } from "../";

import { ComputeForcedKey } from "../../utilites";

const forcedOptions = {
  false: "False",
  true: "True",
  Both: "Both",
};

interface Props {
  languages: ExtendLanguage[];
  item?: ExtendItem;
  submit?: (form: ItemModifyForm) => Promise<void>;
  onSuccess?: () => void;
}

interface State {
  updating: boolean;
  changed: boolean;
  enabled: ExtendLanguage[];
  hi: boolean;
  forced: boolean | string;
}

function mapStateToProps({ system }: StoreState) {
  return {
    languages: system.enabledLanguage,
  };
}

class Editor extends React.Component<Props & ModalProps, State> {
  constructor(props: Props & ModalProps) {
    super(props);

    this.state = {
      enabled:
        props.item?.languages.map((val) => {
          return {
            ...val,
            enabled: true,
          };
        }) ?? [],
      hi: props.item?.hearing_impaired ?? false,
      forced: props.item?.forced ?? false,
      changed: false,
      updating: false,
    };
  }

  updateState<K extends keyof State>(key: K, value: State[K]) {
    let state: State = {
      ...this.state,
      changed: true,
    };
    state[key] = value;
    this.setState(state);
  }

  submitForm() {
    const { submit, onSuccess } = this.props;
    if (submit === undefined) return;

    const { enabled, hi, forced } = this.state;

    this.updateState("updating", true);

    submit({
      languages: enabled.map((val) => val.code2 ?? ""),
      hi,
      forced,
    })
      .then(() => {
        onSuccess && onSuccess();
      })
      .catch((err) => {})
      .finally(() => this.updateState("updating", false));
  }

  render() {
    const { item, languages } = this.props;

    const { changed, enabled, hi, forced, updating } = this.state;

    const footer = (
      <Button
        disabled={!changed || updating}
        onClick={(e) => {
          e.preventDefault();
          this.submitForm();
        }}
      >
        {updating ? (
          <Spinner
            as="span"
            role="status"
            size="sm"
            animation="border"
          ></Spinner>
        ) : (
          <span>Save</span>
        )}
      </Button>
    );

    let forcedKey = ComputeForcedKey(forced);

    return (
      <BasicModal closeable={!updating} {...this.props} footer={footer}>
        <Container fluid>
          <Form>
            <Form.Group>
              <Form.Label>Audio</Form.Label>
              <Form.Control
                type="text"
                disabled
                defaultValue={item?.audio_language.name}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Languages</Form.Label>
              <LanguageSelector
                options={languages}
                defaultSelect={enabled}
                onChange={(val) => this.updateState("enabled", val)}
              ></LanguageSelector>
            </Form.Group>
            <Form.Group>
              <Form.Label>Forced</Form.Label>
              <Selector
                options={forcedOptions}
                defaultKey={forcedKey}
                multiply={false}
                onSelect={(val) => this.updateState("forced", val)}
              ></Selector>
            </Form.Group>
            <Form.Group>
              <Form.Check
                inline
                label="Hearing Impaired"
                defaultChecked={hi}
                onChange={(e) => {
                  this.updateState("hi", e.currentTarget.checked);
                }}
              ></Form.Check>
              {/* <Form.Check
                inline
                label="Forced"
                defaultChecked={forced}
                onChange={(e) => {
                  this.updateState("forced", e.currentTarget.checked);
                }}
              ></Form.Check> */}
            </Form.Group>
          </Form>
        </Container>
      </BasicModal>
    );
  }
}

export default connect(mapStateToProps)(Editor);
