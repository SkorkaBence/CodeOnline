interface ContainerListing {
    id : string;
    name : string;
}

interface ContainerData {
    configuration : ContainerConfiguration;
    last_log : string|null;
    public_key : string;
    running : boolean;
}

interface ContainerConfiguration {
    name : string;
    parent_image : string|null;
    components : string[];
    working_directory : string;
    exposed_ports : ExposedPort[];
    vars: {[id : string] : string};
    build_commands : string[];
    run_commands : string;
    run : RunConfiguration;
    mount : Mount[];
    timezone : string|null;
    build : BuildConfiguration;
}

interface ExposedPort {

}

interface Mount {

}

interface RunConfiguration {
    timeout : number|false;
    retries_when_failed : number;
    watermark : boolean;
}

interface BuildConfiguration {
    enable_cache : boolean;
}