export interface INamespaceInfo {
  kind: NamespaceKind;
  name: string;
}

export enum NamespaceKind {
  Namespace = 0x08,
  PackageNamespace = 0x16,
  PackageInternalNs = 0x17,
  ProtectedNamespace = 0x18,
  ExplicitNamespace = 0x19,
  StaticProtectedNs = 0x1a,
  PrivateNs = 0x05
}

export interface INamespaceSetInfo {
  count: number;
  namespaces: INamespaceInfo[];
}
